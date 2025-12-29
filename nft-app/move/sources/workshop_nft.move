/*
/// Module: semarang_workshop
module semarang_workshop::semarang_workshop;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module semarang_workshop::workshop_nft {
    use std::string::{utf8, String};
    use sui::package;
    use sui::display;

    // One-Time-Witness patern for NFT
    public struct WORKSHOP_NFT has drop {}

    // The NFT struct
    public struct NFT has key, store {
        id: UID,
        name: String,
        description: String,
        url: String,
    }

    fun init(otw: WORKSHOP_NFT, ctx: &mut TxContext) {
        let keys = vector[
            b"name".to_string(),
            b"link".to_string(),
            b"image_url".to_string(),
            b"description".to_string(),
            b"project_url".to_string(),
            b"creator".to_string(),
        ];

        let values = vector[
            b"{name}".to_string(),
            b"{url}".to_string(),
            b"{url}".to_string(),
            b"{description}".to_string(),
            b"https://semarang-workshop.id".to_string(),
            b"Jehuda".to_string(),
        ];

        let publisher = package::claim(otw, ctx);
        let mut display = display::new_with_fields<NFT>(
            &publisher,
            keys,
            values,
            ctx,
        );

        display.update_version();

        transfer::public_transfer(publisher, ctx.sender());
        transfer::public_transfer(display, ctx.sender());
    }

    public fun mint_nft(
        ctx: &mut TxContext
    ): NFT {
        let nft = NFT {
            id: object::new(ctx),
            name: utf8(b"Sui Dev Workshop NFT"),
            description: utf8(b"A commemorative NFT for the 2025 Semarang Sui Developer Workshop."),
            url: utf8(b"https://turquoise-adequate-jay-379.mypinata.cloud/ipfs/bafybeicfbvqubifkwxhorjtolybvj2staix2j4yofaok5zzii75fedk4ua"),
        };

        nft
    }
}
