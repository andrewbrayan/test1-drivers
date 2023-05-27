import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Rider } from "src/modules/rider/schemas/rider.schema";

@Injectable()
export class PaymentsService {
  constructor(private httpService: HttpService) {}

  async createPayment(rider: Rider, amount: number) {
    const timeStamp = Date.now();
    const reference = `${rider.legal_id}-${timeStamp}`;
    const acceptToken = await this.createAcceptToken()
    const payment = {
      acceptance_token: acceptToken,
      amount_in_cents: (Math.ceil(amount) * 100),
      currency: "COP",
      customer_email: rider.customer_email,
      reference: reference,
      customer_data: {
        legal_id: rider.legal_id,
        full_name: rider.full_name,
        ledal_id_type: rider.ledal_id_type,
      },
      payment_method: {
        type: "CARD",
        installments: 1,
        token: process.env.TOKEN_CARD,
      },
    };

    const config = {
      headers: {
        "authorization": `Bearer ${process.env.PUBLICKEY_GATEWAY}`,
      },
    };
    
    return (await firstValueFrom(
      this.httpService.post(`${process.env.URI_GATEWAY}/transactions`, payment, config)
    )).data.data.reference;
  }

  async createAcceptToken() {
    return (await firstValueFrom(
      this.httpService.get(`${process.env.URI_GATEWAY}/merchants/${process.env.PUBLICKEY_GATEWAY}`)
    )).data.data.presigned_acceptance.acceptance_token;
  }
}
