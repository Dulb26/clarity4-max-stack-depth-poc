;; Reserve contract - Clarity 4 (epoch 3.3)
;; Uses NEW as-contract? syntax with explicit allowances

(use-trait ft 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.ft-trait.ft-trait)

(define-constant ERR_INSUFFICIENT_BALANCE (err u105001))
(define-constant sbtc-token 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token)

(define-constant this-contract (as-contract tx-sender))

(define-public (transfer
    (asset <ft>)
    (amount uint)
    (recipient principal)
  )
  (let ((balance (try! (contract-call? asset get-balance this-contract))))
    (asserts! (>= balance amount) ERR_INSUFFICIENT_BALANCE)
    (print {
      action: "transfer",
      data: {
        asset: asset,
        amount: amount,
        recipient: recipient,
      },
    })
    (ok (try! (as-contract (contract-call? asset transfer amount tx-sender recipient none))))
  )
)
