;; Zest Interface - Clarity 3 (epoch 3.0)
;; Mimics: dev-zest-interface-v0-1.clar zest-withdraw function
;; Uses OLD as-contract syntax

(use-trait borrow-helper .zest-borrow-helper-trait-v1-v3.zest-borrow-helper-trait)
(use-trait ft 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.ft-trait.ft-trait)
(use-trait ft-mint 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.ft-mint-trait.ft-mint-trait)
(use-trait oracle 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.oracle-trait.oracle-trait)
(use-trait zest-vault 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.redeemeable-trait-v1-2.redeemeable-trait)
(use-trait incentives 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.incentives-trait-v2-1.incentives-trait)

(define-constant ERR_INVALID_AMOUNT (err u111001))
(define-constant ERR_INSUFFICIENT_BALANCE (err u111002))
(define-constant reserve .reserve-v3)

;;-------------------------------------
;; CRITICAL FUNCTION - MIMICS REAL ZEST WITHDRAW (Clarity 3 version)
;;-------------------------------------

;; @desc Mimics dev-zest-interface-v0-1.clar::zest-withdraw
;; This function uses OLD as-contract syntax (no explicit allowances)
;; Same logic as Clarity 4 version but with traditional as-contract blocks
(define-public (zest-withdraw
  (borrow-helper-trait <borrow-helper>)
  (lp-trait <zest-vault>)
  (pool-reserve principal)
  (asset-trait <ft>)
  (oracle-trait <oracle>)
  (amount uint)
  (assets (list 100 { asset: <ft>, lp-token: <ft-mint>, oracle: <oracle> }))
  (incentives-trait <incentives>)
  (price-feed-1 (optional (buff 8192)))
  (price-feed-2 (optional (buff 8192))))
  (begin
    ;; Write oracle feeds (simulated - just validate they're provided)
    (asserts! (is-some price-feed-1) ERR_INVALID_AMOUNT)
    (asserts! (is-some price-feed-2) ERR_INVALID_AMOUNT)
    
    ;; FIRST as-contract block - Call borrow-helper.withdraw
    ;; OLD SYNTAX: as-contract without explicit allowances
    ;; This has LESS stack depth than Clarity 4's as-contract?
    (as-contract (try! (contract-call? borrow-helper-trait withdraw
      lp-trait
      pool-reserve
      asset-trait
      oracle-trait
      amount
      tx-sender
      assets
      incentives-trait
      none)))
    
    ;; SECOND as-contract block - Transfer asset to reserve
    ;; OLD SYNTAX: as-contract without explicit allowances
    (as-contract (try! (contract-call? asset-trait transfer amount tx-sender reserve none)))
    
    (print { action: "zest-withdraw", data: { asset: asset-trait, amount: amount } })
    (ok true)
  )
)
