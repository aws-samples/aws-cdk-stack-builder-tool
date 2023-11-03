#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CDKBuilderStack } from "../src/cdk-builder-stack";

const app = new cdk.App();
new CDKBuilderStack(app, "cdk-builder");
