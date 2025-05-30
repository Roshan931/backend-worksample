import { NextFunction, Request, Response } from 'express'

export class RESTError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)

    this.status = status
  }
}

export const handleInvalidJsonBody = (err: Error, _: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(422).end('Invalid JSON: Malformed request body')
  }

  next(err)
}
