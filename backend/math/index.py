import json
import re
import math
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Решение математических выражений и задач
    Args: event - запрос с expression параметром
          context - контекст выполнения функции
    Returns: результат вычисления в формате JSON
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
        expression = body_data.get('expression', '')
        
        if not expression:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Expression parameter is required'}),
                'isBase64Encoded': False
            }
        
        try:
            result = solve_math(expression)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'expression': expression,
                    'result': result['result'],
                    'explanation': result['explanation'],
                    'steps': result.get('steps', [])
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
                    'error': f'Ошибка вычисления: {str(e)}',
                    'expression': expression
                }, ensure_ascii=False),
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


def safe_calculate(expression: str) -> float:
    tokens = []
    current_num = ''
    i = 0
    
    while i < len(expression):
        char = expression[i]
        
        if char.isdigit() or char == '.':
            current_num += char
        elif char in '+-*/()':
            if current_num:
                tokens.append(float(current_num))
                current_num = ''
            tokens.append(char)
        elif char == ' ':
            if current_num:
                tokens.append(float(current_num))
                current_num = ''
        i += 1
    
    if current_num:
        tokens.append(float(current_num))
    
    def apply_op(op: str, b: float, a: float) -> float:
        if op == '+': return a + b
        if op == '-': return a - b
        if op == '*': return a * b
        if op == '/': 
            if b == 0:
                raise ValueError('Деление на ноль')
            return a / b
        raise ValueError(f'Неизвестная операция: {op}')
    
    def precedence(op: str) -> int:
        if op in '+-': return 1
        if op in '*/': return 2
        return 0
    
    values = []
    ops = []
    
    i = 0
    while i < len(tokens):
        token = tokens[i]
        
        if isinstance(token, float):
            values.append(token)
        elif token == '(':
            ops.append(token)
        elif token == ')':
            while ops and ops[-1] != '(':
                values.append(apply_op(ops.pop(), values.pop(), values.pop()))
            ops.pop()
        elif token in '+-*/':
            while (ops and ops[-1] != '(' and 
                   precedence(ops[-1]) >= precedence(token)):
                values.append(apply_op(ops.pop(), values.pop(), values.pop()))
            ops.append(token)
        i += 1
    
    while ops:
        values.append(apply_op(ops.pop(), values.pop(), values.pop()))
    
    return values[0] if values else 0


def solve_math(expression: str) -> Dict[str, Any]:
    original = expression
    expression = expression.lower().strip()
    
    expression = expression.replace('×', '*').replace('÷', '/').replace('^', '**')
    expression = expression.replace('х', '*').replace('x', '*')
    
    steps = []
    
    if 'корень' in expression or 'sqrt' in expression:
        match = re.search(r'(?:квадратный\s+)?корень\s+(?:из\s+)?(\d+\.?\d*)', expression)
        if match:
            num = float(match.group(1))
            result = math.sqrt(num)
            steps.append(f'√{num} = {result}')
            return {
                'result': result,
                'explanation': f'Квадратный корень из {num}',
                'steps': steps
            }
    
    if 'факториал' in expression or '!' in expression:
        match = re.search(r'(\d+)\s*!', expression)
        if not match:
            match = re.search(r'факториал\s+(\d+)', expression)
        if match:
            num = int(match.group(1))
            if num > 20:
                raise ValueError('Факториал слишком большого числа (max 20)')
            result = math.factorial(num)
            steps.append(f'{num}! = {result}')
            return {
                'result': result,
                'explanation': f'Факториал числа {num}',
                'steps': steps
            }
    
    if 'процент' in expression or '%' in expression:
        match = re.search(r'(\d+\.?\d*)\s*%\s*(?:от|из)?\s*(\d+\.?\d*)', expression)
        if match:
            percent = float(match.group(1))
            number = float(match.group(2))
            result = (percent / 100) * number
            steps.append(f'{percent}% от {number} = ({percent}/100) × {number} = {result}')
            return {
                'result': result,
                'explanation': f'{percent}% от {number}',
                'steps': steps
            }
    
    if 'степен' in expression:
        match = re.search(r'(\d+\.?\d*)\s*(?:в\s+степени)\s*(\d+\.?\d*)', expression)
        if match:
            base = float(match.group(1))
            exp = float(match.group(2))
            if exp > 100:
                raise ValueError('Степень слишком большая (max 100)')
            result = base ** exp
            steps.append(f'{base}^{exp} = {result}')
            return {
                'result': result,
                'explanation': f'{base} в степени {exp}',
                'steps': steps
            }
    
    clean_expr = re.sub(r'[а-яА-ЯёЁ\s]+', '', expression)
    clean_expr = re.sub(r'[^0-9+\-*/().]', '', clean_expr)
    
    if not clean_expr:
        raise ValueError('Не удалось распознать математическое выражение')
    
    try:
        result = safe_calculate(clean_expr)
        steps.append(f'{clean_expr} = {result}')
        
        return {
            'result': float(result),
            'explanation': f'Результат вычисления: {clean_expr}',
            'steps': steps
        }
    except:
        raise ValueError(f'Не удалось вычислить выражение: {original}')
