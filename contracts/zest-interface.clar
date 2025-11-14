;; Zest Interface

(use-trait borrow-helper .zest-borrow-helper-trait-v1.zest-borrow-helper-trait)
(use-trait ft 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.ft-trait.ft-trait)
(use-trait ft-mint 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.ft-mint-trait.ft-mint-trait)
(use-trait oracle 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.oracle-trait.oracle-trait)
(use-trait zest-vault 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.redeemeable-trait-v1-2.redeemeable-trait)
(use-trait incentives 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.incentives-trait-v2-1.incentives-trait)

(define-constant ERR_INVALID_AMOUNT (err u111001))
(define-constant ERR_INSUFFICIENT_BALANCE (err u111002))

(define-private (write-feed (price-feed (optional (buff 8192))))
  (match price-feed
    bytes
    (begin
      (try! (contract-call? 'SP1CGXWEAMG6P6FT04W66NVGJ7PQWMDAC19R7PJ0Y.pyth-oracle-v4
        verify-and-update-price-feeds bytes {
        pyth-storage-contract: 'SP1CGXWEAMG6P6FT04W66NVGJ7PQWMDAC19R7PJ0Y.pyth-storage-v4,
        pyth-decoder-contract: 'SP1CGXWEAMG6P6FT04W66NVGJ7PQWMDAC19R7PJ0Y.pyth-pnau-decoder-v3,
        wormhole-core-contract: 'SP1CGXWEAMG6P6FT04W66NVGJ7PQWMDAC19R7PJ0Y.wormhole-core-v4,
      }))
      (ok true)
    )
    (ok true)
  )
)

(define-public (zest-supply
    (borrow-helper-trait <borrow-helper>)
    (lp-trait <zest-vault>)
    (pool-reserve principal)
    (asset-trait <ft>)
    (amount uint)
    (referral (optional principal))
    (incentives-trait <incentives>)
  )
  (begin
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (try! (contract-call? .reserve transfer asset-trait amount current-contract))
    (try! (as-contract? ((with-ft (contract-of asset-trait) "*" amount))
      (try! (contract-call? borrow-helper-trait supply lp-trait pool-reserve
        asset-trait amount current-contract referral incentives-trait
      ))
    ))

    (print {
      action: "zest-supply",
      data: {
        asset: asset-trait,
        amount: amount,
      },
    })
    (ok true)
  )
)

(define-public (zest-withdraw
    (borrow-helper-trait <borrow-helper>)
    (lp-trait <zest-vault>)
    (pool-reserve principal)
    (asset-trait <ft>)
    (oracle-trait <oracle>)
    (amount uint)
    (assets (list 100 {
      asset: <ft>,
      lp-token: <ft-mint>,
      oracle: <oracle>,
    }))
    (incentives-trait <incentives>)
    (price-feed-1 (optional (buff 8192)))
    (price-feed-2 (optional (buff 8192)))
  )
  (begin
    (try! (write-feed price-feed-1))
    (try! (write-feed price-feed-2))
    (try! (as-contract? ((with-all-assets-unsafe))
      (begin
        (unwrap-panic (contract-call? borrow-helper-trait withdraw lp-trait pool-reserve
          asset-trait oracle-trait amount current-contract assets
          incentives-trait none
        ))
        true
      )))
    (try! (as-contract? ((with-all-assets-unsafe))
      (begin
        (unwrap-panic (contract-call? asset-trait transfer amount current-contract .reserve
          none
        ))
        true
      )))
    (print {
      action: "zest-withdraw",
      data: {
        asset: asset-trait,
        amount: amount,
      },
    })
    (ok true)
  )
)
