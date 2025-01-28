import FastifyInstrumentation from '@fastify/otel';
import { trace } from '@opentelemetry/api';

const fastifyInstrumentation = new FastifyInstrumentation();
fastifyInstrumentation.setTracerProvider(trace.getTracerProvider());

export { fastifyInstrumentation };
