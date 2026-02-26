import {createCookieSessionStorage, type SessionStorage, type Session} from '@shopify/remix-oxygen';

/**
 * This is a simple session implementation for Hydrogen that uses cookies.
 */
export class HydrogenSession {
  #sessionStorage: SessionStorage;
  #session: Session;

  constructor(sessionStorage: SessionStorage, session: Session) {
    this.#sessionStorage = sessionStorage;
    this.#session = session;
  }

  static async init(request: Request, secrets: string[]) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
      },
    });

    const session = await storage.getSession(request.headers.get('Cookie'));

    return new HydrogenSession(storage, session);
  }

  get has() {
    return this.#session.has;
  }

  get get() {
    return this.#session.get;
  }

  get flash() {
    return this.#session.flash;
  }

  get unset() {
    return this.#session.unset;
  }

  get set() {
    return this.#session.set;
  }

  destroy() {
    return this.#sessionStorage.destroySession(this.#session);
  }

  commit() {
    return this.#sessionStorage.commitSession(this.#session);
  }
}
