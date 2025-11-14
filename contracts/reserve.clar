;; Reserve contract

(use-trait ft 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.ft-trait.ft-trait)

(define-constant ERR_INSUFFICIENT_BALANCE (err u105001))
(define-constant sbtc-token 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token)


(define-public (transfer
    (asset <ft>)
    (amount uint)
    (recipient principal)
  )
  (let ((balance (try! (contract-call? asset get-balance current-contract))))
    (asserts! (>= balance amount) ERR_INSUFFICIENT_BALANCE)
    (print {
      action: "transfer",
      data: {
        asset: asset,
        amount: amount,
        recipient: recipient,
      },
    })
    (try! (as-contract? ((with-ft (contract-of asset) "*" amount))
      (begin
        (unwrap-panic (contract-call? asset transfer amount tx-sender recipient none))
        true
      )))
    (ok true)
  )
)
