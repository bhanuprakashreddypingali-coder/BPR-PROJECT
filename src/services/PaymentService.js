import API from "./ApiService";

const PaymentService = {

    // =====================================================
    // MAKE PAYMENT
    // =====================================================

    makePayment: (paymentData) => {

        console.log("");
        console.log("========== PAYMENT REQUEST ==========");

        console.log(
            "Order ID:",
            paymentData?.orderId
        );

        console.log(
            "Payment Method:",
            paymentData?.paymentMethod
        );

        console.log(
            "JWT exists:",
            !!localStorage.getItem("token")
        );

        console.log("=====================================");
        console.log("");

        return API.post(
            "/payments",
            paymentData
        );
    },


    // =====================================================
    // GET PAYMENT BY ORDER
    // =====================================================

    getPaymentByOrderId: (orderId) => {

        console.log(
            "Getting payment for order:",
            orderId
        );

        return API.get(
            `/payments/order/${orderId}`
        );
    },


    // =====================================================
    // GET MY PAYMENTS
    // =====================================================

    getMyPayments: () => {

        console.log(
            "Getting current user's payments"
        );

        return API.get(
            "/payments/my"
        );
    }

};

export default PaymentService;