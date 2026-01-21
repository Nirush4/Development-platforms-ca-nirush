export function CookieConsentView(): void {
  if (document.getElementById('cookie-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'cookie-modal';
  modal.className =
    'fixed inset-0 z-50 flex items-center justify-center hidden bg-transparent backdrop-blur-sm';

  modal.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 mx-6 text-gray-900 animate-fadeIn">
      <div class="flex flex-col space-y-4">
        <h2 class="text-lg sm:text-2xl font-extrabold text-gray-900">
          We Value Your Privacy
        </h2>

        <p class="text-gray-700 text-sm sm:text-base leading-relaxed">
          Our website uses cookies to personalize your experience, enhance security, and analyze traffic.
          By clicking "Accept All Cookies", you consent to our use of cookies as described in our
          <a href="/privacy-policy" class="underline text-indigo-600 hover:text-indigo-800 font-medium">
            Privacy Policy
          </a>.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            id="accept-cookies"
            class="flex-1 text-sm sm:text-base bg-black
                   text-white font-semibold py-2 rounded-xl shadow-md
                   hover:bg-black/80
                   transition-all duration-300 cursor-pointer"
          >
            Accept All Cookies
          </button>

          <button
            id="reject-cookies"
            class="flex-1 text-sm sm:text-base border border-gray-300
                   text-gray-800 font-semibold py-2 rounded-xl
                   hover:bg-gray-200 transition-all duration-300 cursor-pointer"
          >
            Only Necessary Cookies
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [key, val] = cookie.split('=');
    if (key === name) return decodeURIComponent(val);
  }
  return null;
}

function showModal() {
  const modal = document.getElementById('cookie-modal');
  if (modal) modal.classList.remove('hidden');
}

function hideModal() {
  const modal = document.getElementById('cookie-modal');
  if (modal) modal.classList.add('hidden');
}

export function initCookieConsent() {
  const consent = getCookie('cookie-consent');

  if (!consent) {
    CookieConsentView();
    showModal();

    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');

    if (!acceptBtn || !rejectBtn) {
      console.error('Cookie consent buttons not found!');
      return;
    }

    acceptBtn.addEventListener('click', () => {
      setCookie('cookie-consent', 'accepted', 365);
      hideModal();
    });

    rejectBtn.addEventListener('click', () => {
      setCookie('cookie-consent', 'rejected', 365);
      hideModal();
    });
  }
}
