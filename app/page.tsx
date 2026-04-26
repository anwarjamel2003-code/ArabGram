import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4" dir="rtl">
      
      <div className="flex max-w-[850px] w-full gap-8 items-center justify-center">
        
        {/* Left Side (RTL) - Phone Mockup (Hidden on mobile) */}
        <div className="hidden md:block w-[380px] h-[581px] relative bg-[url('https://static.cdninstagram.com/images/instagram/xig/homepage/phones/home-phones.png?__makehaste_cache_breaker=HOgRclNOosk')] bg-no-repeat bg-[length:468.32px_634.15px] bg-[-46px_0]">
          {/* We can put an image slider here if we want to perfectly replicate IG, but a static image is fine */}
          <div className="absolute top-[27px] right-[112.5px]">
            <div className="w-[250px] h-[538px] bg-slate-200">
               <Image 
                 src="/arabgram-logo.png" 
                 alt="App Screenshot" 
                 width={250} 
                 height={538} 
                 className="w-full h-full object-cover"
               />
            </div>
          </div>
        </div>

        {/* Right Side (RTL) - Auth Box */}
        <div className="w-full max-w-[350px] flex flex-col gap-3">
          
          <div className="bg-white border border-slate-300 p-10 flex flex-col items-center">
            <h1 className="text-4xl font-serif italic font-bold mb-10 mt-4 tracking-wider">ArabGram</h1>
            
            <form className="w-full flex flex-col gap-2 mb-4">
              <input 
                type="text" 
                placeholder="رقم الهاتف، اسم المستخدم أو البريد الإلكتروني" 
                className="w-full bg-[#fafafa] border border-slate-300 rounded-[3px] px-2 py-2 text-xs focus:outline-none focus:border-slate-400"
              />
              <input 
                type="password" 
                placeholder="كلمة السر" 
                className="w-full bg-[#fafafa] border border-slate-300 rounded-[3px] px-2 py-2 text-xs focus:outline-none focus:border-slate-400"
              />
              <Link href="/auth/signin" className="w-full">
                <button type="button" className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold rounded-lg py-1.5 mt-3 text-sm transition-colors">
                  تسجيل الدخول
                </button>
              </Link>
            </form>

            <div className="w-full flex items-center gap-4 my-4">
              <div className="h-[1px] bg-slate-300 flex-1"></div>
              <span className="text-slate-500 font-semibold text-[13px]">أو</span>
              <div className="h-[1px] bg-slate-300 flex-1"></div>
            </div>

            <Link href="/auth/signin" className="flex items-center gap-2 text-[#385185] font-semibold text-sm mb-4 mt-2">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              تسجيل الدخول بحساب فيسبوك
            </Link>

            <Link href="/auth/forgot" className="text-[#00376b] text-xs mt-2">
              هل نسيت كلمة السر؟
            </Link>
          </div>

          <div className="bg-white border border-slate-300 p-6 flex items-center justify-center text-sm">
            <span>ليس لديك حساب؟</span>
            <Link href="/auth/signup" className="text-[#0095f6] font-semibold mr-1">
              تسجيل
            </Link>
          </div>

          <div className="text-center mt-2 text-sm">
            <p className="mb-4">احصل على التطبيق.</p>
            <div className="flex justify-center gap-2">
              <img src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png" alt="Get it on Google Play" className="h-10 cursor-pointer" />
              <img src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png" alt="Download on the App Store" className="h-10 cursor-pointer" />
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center text-xs text-slate-500 flex flex-wrap justify-center gap-x-4 gap-y-2 px-4">
        <Link href="#">Meta</Link>
        <Link href="#">حول</Link>
        <Link href="#">المدونة</Link>
        <Link href="#">الوظائف</Link>
        <Link href="#">مساعدة</Link>
        <Link href="#">واجهة برمجة التطبيقات</Link>
        <Link href="#">الخصوصية</Link>
        <Link href="#">الشروط</Link>
        <Link href="#">المواقع</Link>
        <Link href="#">Instagram Lite</Link>
        <Link href="#">Threads</Link>
        <div className="w-full mt-2">
          <span>العربية</span>
          <span className="mx-2">© 2026 ArabGram من Meta (افتراضي)</span>
        </div>
      </footer>
    </div>
  )
}
