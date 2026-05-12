import { httpFacade } from "../../facades/http.facade";

interface WhatsAppConfig {
  token: string;
  phoneNumberId: string;
}

export class WhatsAppService {
  private config: WhatsAppConfig;

  constructor() {
    this.config = {
      token: process.env.WHATSAPP_TOKEN || "",
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
    };
  }

  private verificationCodes = new Map<string, { code: string; expiresAt: Date }>();

  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  storeCode(phoneNumber: string, code: string): void {
    this.verificationCodes.set(phoneNumber, {
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
  }

  validateCode(phoneNumber: string, code: string): boolean {
    const stored = this.verificationCodes.get(phoneNumber);
    if (!stored) return false;
    if (new Date() > stored.expiresAt) {
      this.verificationCodes.delete(phoneNumber);
      return false;
    }
    if (stored.code !== code) return false;
    this.verificationCodes.delete(phoneNumber);
    return true;
  }

  async sendVerificationCode(phoneNumber: string, code: string): Promise<void> {
    if (!this.config.token || !this.config.phoneNumberId) {
      console.log(`[DEV] Verification code for ${phoneNumber}: ${code}`);
      return;
    }

    await httpFacade.post(
      `https://graph.facebook.com/v22.0/${this.config.phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: phoneNumber,
        recipient_type: "individual",
        type: "template",
        template: {
          name: "verification_code",
          language: { code: "es_CO" },
          components: [
            {
              type: "body",
              parameters: [{ type: "text", text: code }],
            },
            {
              "type": "button",
              "sub_type": "url",
              "index": "0",
              "parameters": [
                {
                  "type": "text",
                  "text": code
                }
              ]
            }
          ],
        },
      },
      {
        Authorization: `Bearer ${this.config.token}`,
      }
    );
  }
}

export const whatsAppService = new WhatsAppService();
