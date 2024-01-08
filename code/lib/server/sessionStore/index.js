import { randomBytes } from 'node:crypto';
import { getUserRoles } from '../db';

const sessionStore = new Map();
let nextClean = Date.now() + 1000 * 60 * 60; // 1 hour

function getSid() {
    return randomBytes(32).toString('hex');
}

function clean() {
    const now = Date.now();
    for (const [sid, session] of sessionStore) {
        if (session.invalidAt < now) {
            sessionStore.delete(sid);
        }
    }
    nextClean = Date.now() + 1000 * 60 * 60; // 1 hour
}

export function createSession(name, email, maxAge) {
    let sid = '';

    do {
        sid = getSid();
    } while (sessionStore.has(sid));

    sessionStore.set(sid, {
        name,
        email,
        invalidAt: Date.now() + maxAge,
    });

    return sid;
}

if (Date.now() > nextClean) {
    setTimeout(() => {
        clean();
    }, 5000);
}

export function getSession(sid) {
    const session = sessionStore.get(sid);
    if (session) {
        if (Date.now() > session.invalidAt) {
            console.log('delete invalid session', sid);
            sessionStore.delete(sid);
            return undefined;
        } else {
            return session;
        }
    } else {
        console.log('session not found', sid);
        return undefined;
    }
}

