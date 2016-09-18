export function decorateWithBoom(boom, context) {
  context.response.status = boom.output.statusCode;
  context.body = boom.output.payload;
}
