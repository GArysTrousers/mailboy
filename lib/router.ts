export class Router {

  private routes: IRoute[] = [];

  constructor() { }

  add(route: IRoute) {
    this.routes.push(route);
    return this;
  }

  get(pattern: string, resolver: Resolver) {
    this.routes.push({ method: 'GET', pattern, resolver })
    return this;
  }

  post(pattern: string, resolver: Resolver) {
    this.routes.push({ method: 'POST', pattern, resolver })
    return this;
  }

  async resolve(request: Request, info: RequestInfo) {

    const url = new URL(request.url)
    console.log(`${info.hostname}: ${url.pathname}`);

    for (const route of this.routes) {
      if (request.method === route.method && url.pathname === route.pattern) {
        try {
          const res = await route.resolver({
            request,
            responce: {
              body: null,
              init: {
                headers: new Headers(),
                status: 200,
              }
            },
            url,
            info
          })
          return new Response(res.body, res.init)
        } catch (e) {
          console.log(e);
          if (e instanceof HttpError) {
            return new Response(e.message, { status: e.status })
          }
          return new Response(null, { status: 500 })
        }
      }
    }
    return new Response(null, { status: 404 })
  }
}

interface IRoute {
  method: HttpMethod;
  pattern: string;
  resolver: Resolver;
}

interface ResponseData {
  body: BodyInit | null,
  init: {
    headers: Headers;
    status: number;
    statusText?: string;
  }
}

type Resolver = (data: RequestData) => Promise<ResponseData>;
type HttpMethod = "GET" | "POST"

interface RequestData {
  request: Request,
  responce: ResponseData,
  url: URL,
  info: RequestInfo
}

interface RequestInfo {
  transport: "tcp" | "udp";
  hostname: string;
  port: number;
}

export class HttpError extends Error {
  status: number;
  override message: string;
  
  constructor(status: number, message: string) {
    super();
    this.status = status
    this.message = message
  }
}