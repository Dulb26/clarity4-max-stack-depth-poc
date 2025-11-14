;; Trading contract - Clarity 4 (epoch 3.3)
;; Mimics: dev-trading-v0-1.clar zest-withdraw-fund function
;; Uses NEW as-contract? syntax

(use-trait borrow-helper .zest-borrow-helper-trait-v1.zest-borrow-helper-trait)
(use-trait ft 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.ft-trait.ft-trait)
(use-trait ft-mint 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.ft-mint-trait.ft-mint-trait)
(use-trait oracle 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.oracle-trait.oracle-trait)
(use-trait zest-vault 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.redeemeable-trait-v1-2.redeemeable-trait)
(use-trait incentives 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.incentives-trait-v2-1.incentives-trait)

(define-constant ERR_INVALID_AMOUNT (err u120001))
(define-constant ERR_EMPTY_CLAIM_IDS (err u120002))

;; -------------------------------------
;; Main Trading Operation - MIMICS REAL FLOW
;; -------------------------------------

;; @desc Mimics dev-trading-v0-1.clar::zest-withdraw-fund
;; This is the function that hits MaxStackDepth in Clarity 4
(define-public (zest-withdraw-fund
    (borrow-helper-trait <borrow-helper>)
    (lp-sbtc-trait <zest-vault>)
    (sbtc-token-trait <ft>)
    (oracle-trait <oracle>)
    (incentives-trait <incentives>)
    (collateral-amount uint)
    (claim-ids (list 1000 uint))
    (pool-reserve-data principal)
    (assets (list 100 {
      asset: <ft>,
      lp-token: <ft-mint>,
      oracle: <oracle>,
    }))
    (price-feed-1 (optional (buff 8192)))
    (price-feed-2 (optional (buff 8192)))
  )
  (begin
    (asserts! (> collateral-amount u0) ERR_INVALID_AMOUNT)
    (asserts! (> (len claim-ids) u0) ERR_EMPTY_CLAIM_IDS)

    ;; Step 1: Withdraw sBTC collateral from Zest (THIS IS WHERE STACK DEPTH GROWS)
    (try! (contract-call? .zest-interface zest-withdraw borrow-helper-trait
      lp-sbtc-trait pool-reserve-data sbtc-token-trait oracle-trait
      collateral-amount assets incentives-trait price-feed-1 price-feed-2
    ))

    (print {
      action: "zest-withdraw-fund-claims",
      data: { collateral-amount: collateral-amount },
    })
    (ok true)
  )
)
