import { PubSub } from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PubSubService {
  private readonly pubSubClient = new PubSub();

  writeMessages(message: string) {
    const messageBuffer = Buffer.from(message);
    this.pubSubClient
      .topic('projects/pro-core-430809-a8/topics/hospitla-topic')
      .publishMessage({ data: messageBuffer });
  }
}
