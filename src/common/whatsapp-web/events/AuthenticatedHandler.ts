import { ClientSession } from "whatsapp-web.js";

export interface AuthenticatedHandler {
  /**
   * @param session Object containing session information, when using LegacySessionAuth. Can be used to restore the session.
   */
  onAuthenticated(session?: ClientSession): Promise<void>;
}
