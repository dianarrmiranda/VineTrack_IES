FROM python:3
COPY requirements.txt /tmp/
RUN pip install --requirement /tmp/requirements.txt
ADD . /
CMD ["python3", "/main.py"]