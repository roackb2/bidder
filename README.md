# Bidder

This is a simple bidding system, that users could sell items and buy items by bidding.

# Run

## Run Locally

To run locally, you could just issue `npm start`, with some service running on your local computer, including:

* Redis server, with no protection mode
* RabbitMQ server, with following controlling commands issued:
    *  rabbitmqctl add_user test test
    *  rabbitmqctl set_user_tags test administrator
    *  rabbitmqctl set_permissions -p / test ".\*" ".\*" ".\*"


You also have to setup local environment variables like following, substituting variables with your own needs,
if not setting RabbitMQ as stated above:

```bash
export AWS_REGISTRY=1234.dkr.ecr.us-east-1.amazonaws.com
export REDIS_CLUSTER=localhost
export RABBIT_HOST=localhost
export RABBIT_USER=test
export RABBIT_PASSWORD=test
export RABBIT_VHOST=test
```
