;; @contract Zest Borrow Helper Trait
;; @version 1

(use-trait ft 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.ft-trait.ft-trait)
(use-trait ft-mint-trait 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.ft-mint-trait.ft-mint-trait)
(use-trait oracle-trait 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.oracle-trait.oracle-trait)
(use-trait redeemeable-token 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.redeemeable-trait-v1-2.redeemeable-trait)
(use-trait incentives-trait 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.incentives-trait-v2-1.incentives-trait)

;; -------------------------------------
;; Trait Definition
;; -------------------------------------

(define-trait zest-borrow-helper-trait (
  (supply
    (
      <redeemeable-token>
      principal
      <ft>
      uint
      principal
      (optional principal)
      <incentives-trait>
    )
    (response bool uint)
  )
  (borrow
    (
      principal
      <oracle-trait>
      <ft>
      <ft>
      (list 100 {
      asset: <ft>,
      lp-token: <ft>,
      oracle: <oracle-trait>,
    })
      uint
      principal
      uint
      principal
      (optional (buff 8192))
    )
    (response bool uint)
  )
  (repay
    (
      <ft>
      uint
      principal
      principal
    )
    (response bool uint)
  )
  (withdraw
    (
      <redeemeable-token>
      principal
      <ft>
      <oracle-trait>
      uint
      principal
      (list 100
      {
      asset: <ft>,
      lp-token: <ft-mint-trait>,
      oracle: <oracle-trait>,
    })
      <incentives-trait>
      (optional (buff 8192))
    )
    (response bool uint)
  )
  (claim-rewards
    (
      <redeemeable-token>
      principal
      <ft>
      <oracle-trait>
      principal
      (list 100
      {
      asset: <ft>,
      lp-token: <ft-mint-trait>,
      oracle: <oracle-trait>,
    })
      <ft>
      <incentives-trait>
      (optional (buff 8192))
    )
    (response bool uint)
  )
))
