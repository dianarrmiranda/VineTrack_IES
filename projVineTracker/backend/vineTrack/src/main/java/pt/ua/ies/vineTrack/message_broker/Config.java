package pt.ua.ies.vineTrack.message_broker;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class Config {

    public static final String QUEUE_NAME = "vinetracker";
    public static final String EXCHANGE_NAME = "";

    @Bean
    Queue queue1() { return new Queue(QUEUE_NAME, true);}

    @Bean
    DirectExchange exchange() { return new DirectExchange(EXCHANGE_NAME);}

    @Bean
    public Binding binding1(@Qualifier("queue1") Queue queue1, DirectExchange exchange) {
        return BindingBuilder.bind(queue1).to(exchange).with(QUEUE_NAME);
    }

    @Bean
    public RabbitmqHandler receiver() {
        return new RabbitmqHandler();
    }
}
