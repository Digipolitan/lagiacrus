import {Middleware} from 'koa';

export type MiddlewaresBuilder = () => Middleware[];
