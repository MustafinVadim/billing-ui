import Raven from "raven-js";
import { LogSentryLevel } from "../constants";

class SentryTransport {
    push(log) {
        Raven.captureException(new Error(log.message), {
            level: LogSentryLevel[log.level]
        });
    }
}

export default SentryTransport;
