from app import app
from config import config
import os

if __name__ == '__main__':
    env = os.getenv('FLASK_ENV', 'development')
    app_config = config.get(env, config['default'])
    
    app.run(
        debug=app_config.DEBUG,
        host=app_config.HOST,
        port=app_config.PORT
    )