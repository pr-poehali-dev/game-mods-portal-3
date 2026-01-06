import json
import os
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для управления модами и модерации'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    
    try:
        if method == 'GET':
            return get_mods(conn, event)
        elif method == 'POST':
            return create_mod(conn, event)
        elif method == 'PUT':
            return update_mod_status(conn, event)
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    finally:
        conn.close()

def get_current_user(conn, token: str):
    if not token:
        return None
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            '''SELECT u.id, u.role 
               FROM users u 
               JOIN sessions s ON s.user_id = u.id 
               WHERE s.session_token = %s AND s.expires_at > NOW()''',
            (token,)
        )
        return cur.fetchone()

def get_mods(conn, event: dict) -> dict:
    token = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')
    user = get_current_user(conn, token)
    
    params = event.get('queryStringParameters') or {}
    status_filter = params.get('status', 'approved')
    game_filter = params.get('game')
    category_filter = params.get('category')
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        query = '''
            SELECT m.*, u.username as author_name,
                   COALESCE(AVG(r.rating), 0) as rating,
                   COUNT(DISTINCT r.id) as review_count
            FROM mods m
            LEFT JOIN users u ON m.author_id = u.id
            LEFT JOIN reviews r ON m.id = r.mod_id
            WHERE 1=1
        '''
        params_list = []
        
        if user and user['role'] in ['moderator', 'admin']:
            if status_filter != 'all':
                query += ' AND m.status = %s'
                params_list.append(status_filter)
        else:
            query += ' AND m.status = %s'
            params_list.append('approved')
        
        if game_filter:
            query += ' AND m.game = %s'
            params_list.append(game_filter)
        
        if category_filter:
            query += ' AND m.category = %s'
            params_list.append(category_filter)
        
        query += ' GROUP BY m.id, u.username ORDER BY m.created_at DESC'
        
        cur.execute(query, params_list)
        mods = [dict(row) for row in cur.fetchall()]
        
        for mod in mods:
            mod['created_at'] = mod['created_at'].isoformat() if mod['created_at'] else None
            mod['updated_at'] = mod['updated_at'].isoformat() if mod['updated_at'] else None
            mod['rating'] = float(mod['rating'])
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'mods': mods}),
            'isBase64Encoded': False
        }

def create_mod(conn, event: dict) -> dict:
    token = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')
    user = get_current_user(conn, token)
    
    if not user:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'}),
            'isBase64Encoded': False
        }
    
    body = json.loads(event.get('body', '{}'))
    
    required_fields = ['title', 'game', 'category', 'description', 'version']
    if not all(body.get(field) for field in required_fields):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing required fields'}),
            'isBase64Encoded': False
        }
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            '''INSERT INTO mods (title, game, category, author_id, description, version, requirements, image_emoji, status)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'pending')
               RETURNING id, title, status''',
            (
                body['title'],
                body['game'],
                body['category'],
                user['id'],
                body['description'],
                body['version'],
                body.get('requirements', ''),
                body.get('image_emoji', '📦')
            )
        )
        mod = dict(cur.fetchone())
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'mod': mod}),
            'isBase64Encoded': False
        }

def update_mod_status(conn, event: dict) -> dict:
    token = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')
    user = get_current_user(conn, token)
    
    if not user or user['role'] not in ['moderator', 'admin']:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Forbidden: moderator access required'}),
            'isBase64Encoded': False
        }
    
    body = json.loads(event.get('body', '{}'))
    mod_id = body.get('mod_id')
    new_status = body.get('status')
    rejection_reason = body.get('rejection_reason')
    
    if not mod_id or not new_status:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing mod_id or status'}),
            'isBase64Encoded': False
        }
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            '''UPDATE mods 
               SET status = %s, rejection_reason = %s, updated_at = NOW()
               WHERE id = %s
               RETURNING id, title, status''',
            (new_status, rejection_reason, mod_id)
        )
        mod = cur.fetchone()
        
        if not mod:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Mod not found'}),
                'isBase64Encoded': False
            }
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'mod': dict(mod)}),
            'isBase64Encoded': False
        }
