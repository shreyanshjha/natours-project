import axios from 'axios';
import { showAlert } from './alerts';
export const bookTour = async tourId => {
    try {
        // 1) Get checkout session from backend
        const session = await axios.get(
            //`http://localhost:3000/api/v1/booking/checkout-session/${tourId}`
            `/api/v1/booking/checkout-session/${tourId}`
        );
        //console.log("res", session);
        // 2) Create checkout form + charge credit card
        // await stripe.redirectToCheckout({
        //     sessionId: session.data.session.id
        // });
        window.location.href = session.data.session.url;

    } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message);
    }
}