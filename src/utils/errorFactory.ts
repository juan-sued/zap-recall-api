export function notFound(entity: string) {
  return {
    type: 'error_not_found',
    message: `${entity} was not found.`,
  };
}

export function conflict(message: string) {
  return {
    type: 'error_conflict',
    message: `${message} already exist.`,
  };
}

export function unauthorized(entity: string) {
  return {
    type: 'error_unauthorized',
    message: entity,
  };
}

export function unprocessableEntity(messages: string[]) {
  return {
    type: 'error_unprocessable_entity',
    message: messages,
  };
}

export function forbidden() {
  return {
    type: 'error_forbidden',
    message: 'Email or password are invalid.',
  };
}
