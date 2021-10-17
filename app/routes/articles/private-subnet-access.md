---
meta:
  title: Controlling access to private subnets
  description: AWS networking mumbo jumbo
---

# What are my options?

## Use a load balancer

- great for HTTP
- routing targets

## Just put it in a public subnet

- bad for databases in particular

## Use a vendor

- well, sure!

## VPC endpoints

- great for stuff inside the VPC
- not LB targetable AFAIK

## Use something else in a public subnet

- dedicated ec2 "appliance"
- elastic IP

## What about an NLB?

- can't secure it! it does preserve client IPs tho so you maybe could
- routing targets
