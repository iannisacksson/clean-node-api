class SignUpController {
  public handle(httpRequest: any): any {
    if (!httpRequest.body.name) {
      return { statusCode: 400, body: new Error('Missing param: name') };
    }

    if (!httpRequest.body.mail) {
      return { statusCode: 400, body: new Error('Missing param: email') };
    }

    return {};
  }
}

export { SignUpController };
