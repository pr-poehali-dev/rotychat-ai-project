import json
import urllib.request
import urllib.parse
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Поиск информации в интернете через DuckDuckGo API
    Args: event - запрос с query параметром
          context - контекст выполнения функции
    Returns: результаты поиска в формате JSON
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        query = body_data.get('query', '')
        
        if not query:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Query parameter is required'}),
                'isBase64Encoded': False
            }
        
        try:
            encoded_query = urllib.parse.quote(query)
            url = f'https://api.duckduckgo.com/?q={encoded_query}&format=json&no_html=1&skip_disambig=1'
            
            req = urllib.request.Request(url, headers={
                'User-Agent': 'RotyChat/1.0'
            })
            
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode('utf-8'))
            
            results = []
            
            if data.get('AbstractText'):
                results.append({
                    'title': data.get('Heading', 'Информация'),
                    'snippet': data.get('AbstractText', ''),
                    'url': data.get('AbstractURL', '')
                })
            
            for item in data.get('RelatedTopics', [])[:5]:
                if 'Text' in item and 'FirstURL' in item:
                    results.append({
                        'title': item.get('Text', '').split(' - ')[0] if ' - ' in item.get('Text', '') else 'Результат',
                        'snippet': item.get('Text', ''),
                        'url': item.get('FirstURL', '')
                    })
            
            if not results:
                results.append({
                    'title': 'Результаты не найдены',
                    'snippet': f'К сожалению, по запросу "{query}" информация не найдена. Попробуйте переформулировать вопрос.',
                    'url': ''
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'query': query,
                    'results': results
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': f'Search error: {str(e)}',
                    'query': query
                }),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
