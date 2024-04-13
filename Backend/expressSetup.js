const express = require("express");
const cors = require('cors');
require('dotenv').config();
const { PORT, AWS_REGION, TABLE_NAME } = process.env;
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');



module.exports = setUpExpressApp;
