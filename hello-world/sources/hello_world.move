/*
/// Module: hello_world
module hello_world::hello_world;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions
module hello_world::greeting {
    use std::string;

    public struct Greeting has key {
        id: UID,
        text: string::String,
    }

    public fun new(ctx: &mut TxContext) {
        let new_greeting: Greeting = Greeting {
            id: object::new(ctx),
            text: b"Helo world!".to_string()
        };
        transfer::share_object(new_greeting);
    }

    public fun update_text(greeting: &mut Greeting, new_text: string::String) {
        greeting.text = new_text;
    }
}
    