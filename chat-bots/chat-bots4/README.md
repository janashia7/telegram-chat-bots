# Weather forecast bot

**Task : Create telegram bot what on message with geolocation sends weather forecast to user.**

- Check https://openweathermap.org/api. It will be used as data provider

## Running app link

[Click here to message bot](https://t.me/janashia2_bot)

## Deploy instruction using docker cli and aws cli

**Step 1: Build the image from Dockerfile**

```sh
    docker build -t weatherbot .
```

**Step 2: Authenticate aws registry**

```sh
    aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 672300429544.dkr.ecr.eu-central-1.amazonaws.com
```

**Step 3: Tag the image to push repository**

```sh
    docker tag weatherbot:latest 672300429544.dkr.ecr.eu-central-1.amazonaws.com/weatherbot:latest
```

**Step 4: Push the image**

```sh
    docker push 672300429544.dkr.ecr.eu-central-1.amazonaws.com/weatherbot:latest
```

**Step 5: Deploy to aws**
create security group

```sh
    aws ec2 create-security-group --group-name weatherbot-security-group --description "weatherbot Security Group"
    aws ec2 authorize-security-group-ingress --group-name weatherbot-security-group --protocol tcp --port 80 --cidr 0.0.0.0/0
    aws ec2 authorize-security-group-ingress --group-name weatherbot-security-group --protocol tcp --port 443 --cidr 0.0.0.0/0
```

create ec2 instance

```sh
    aws ec2 run-instances --image-id ami-0ed9277fb7eb570c9 --count 1 --instance-type t3.micro --security-groups weatherbot-security-group --iam-instance-profile Name=weatherbot-instance-profile --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=weatherbot}]' --user-data $'#!/bin/sh\nyum update -y\namazon-linux-extras install docker -y\nservice docker start\nusermod -a -G docker ec2-user\nchkconfig docker on\ndocker login -u AWS -p $(aws ecr get-login-password --region eu-central-1) 672300429544.dkr.ecr.eu-central-1.amazonaws.com\ndocker pull 672300429544.dkr.ecr.eu-central-1.amazonaws.com/weatherbot:latest\ndocker run -p 80:3000 --rm 672300429544.dkr.ecr.eu-central-1.amazonaws.com/weatherbot:latest'
```
