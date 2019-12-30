/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe('pk_test_7i7p3KzLbCV8PaCNUogZrSXy003QFLHZJj');

export const bookTour = async tourId => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
