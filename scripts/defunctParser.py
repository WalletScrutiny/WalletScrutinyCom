import yaml
from datetime import datetime, timedelta

def parse_yaml_file(file_path):
    with open(file_path, 'r') as file:
        data = yaml.safe_load(file)
    data = {str(key): value for key, value in data.items()}
    return data

def get_old_app_ids(yaml_data, days_threshold=15):
    old_app_ids = []
    current_date = datetime.now()
    date_threshold = current_date - timedelta(days=days_threshold)
    for date_str, app_ids in yaml_data.items():
        if app_ids is not None: 
            date_added = datetime.strptime(date_str, '%Y-%m-%d')
            if (current_date - date_added).days >= days_threshold:
                cleaned_app_ids = [app_id.replace('_', '', 1) for app_id in app_ids]
                old_app_ids.extend(cleaned_app_ids)
    return old_app_ids, date_threshold.strftime('%Y-%m-%d')

def format_app_ids(app_ids):
    return ','.join(app_ids)

if __name__ == "__main__":
    yaml_file_path = '_data/defunct.yaml'
    data = parse_yaml_file(yaml_file_path)
    
    old_app_ids, date_threshold = get_old_app_ids(data)
    formatted_app_ids = format_app_ids(old_app_ids)
    print(formatted_app_ids)
