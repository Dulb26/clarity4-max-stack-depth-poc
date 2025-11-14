;; Simple vault trait for testing
;; This mimics the Zest pool interface for deposit/redeem operations

(define-trait vault-trait
  (
    ;; Deposit assets and receive shares
    (deposit (uint uint principal) (response uint uint))

    ;; Redeem shares for assets
    (redeem (uint uint principal) (response uint uint))

    ;; Get balance of shares
    (get-balance (principal) (response uint uint))

    ;; Transfer shares
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))
  )
)
