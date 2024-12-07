FROM python:3.10-slim
WORKDIR /backend
COPY requirements.txt /backend
RUN pip install --no-cache-dir -r requirements.txt
COPY  . /backend
EXPOSE 8001
RUN  apt-get update && apt-get install -y procps
CMD [ "python","-u", "gameback/manage.py", "runserver", "0.0.0.0:8001"]