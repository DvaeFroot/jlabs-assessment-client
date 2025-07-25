import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router"
import * as AuthService from "~/services/authService"

type FormError = {
  name?: string,
  email?: string,
  pass?: string
}

export default function Signup() {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPass] = useState<string>("")
  const [csrfTokenFetched, setCsrfTokenFetched] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormError>({})
  const [hasUser, setHasUser] = useState<any>(true);

  let navigate = useNavigate()

  useEffect((): void => {
    const tokenType = sessionStorage.getItem("token_type");
    const accessToken = sessionStorage.getItem("access_token");

    if (!tokenType || !accessToken) {
      setHasUser(false)
      return;
    }

    const fetchUser = async (): Promise<void> => {
      try {
        const user = await AuthService.getUser(tokenType, accessToken);
        navigate("/home");
      } catch (error) {
        console.log("Error fetching user data:", error);
        setHasUser(false)
      }
    };

    fetchUser();
  }, [navigate]);

  if (hasUser) {
    return (
      <div>
        <div className="flex h-screen w-screen items-center justify-center bg-gray-500">
          Loading...
        </div>
      </div>
    )
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value)
  }
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPass(e.target.value)
  }

  const validateForm = (): FormError => {
    const validationErrors: FormError = {}

    if (!name) validationErrors.name = "Full Name is required."
    if (!email) {
      validationErrors.email = "Email is required."
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Email is not valid."
    }
    if (!password) {
      validationErrors.pass = "Password is required."
    } else if (password.length < 8) {
      validationErrors.pass = "Password must be at least 8 characters."
    }

    return validationErrors
  }

  const handleRegistration = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const validationErrors: FormError = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})

    try {
      if (!csrfTokenFetched) {
        await AuthService.getcsrf()
        setCsrfTokenFetched(true);
      }

      const response = await AuthService.signup(name, email, password, setErrors)

      if (!response.success) {
        throw new Error("Error signing up.")
      }

      sessionStorage.setItem("access_token", response.data.access_token)
      sessionStorage.setItem("token_type", response.data.token_type)

      navigate("/home")
    } catch (error: any) {
      console.log(error.response)
    }
  }

  return (
    <>
      {/* PAGE CONTAINER */}
      <div className="bg-gray-500 h-screen w-screen flex items-center justify-center">

        {/* SIGNUP CONTAINER */}
        <div className="bg-gray-300 w-[350px] px-5 py-5 rounded-md drop-shadow-2xl">

          {/* FORM FIELDS */}
          <div>
            {/* FULLNAME */}
            <div>
              <div className="mb-3 font-bold">
                Full Name
              </div>
              <div className="mb-3">
                <input type="text" onChange={handleNameChange} className="w-full bg-white px-2 py-2 rounded-lg" />
                {errors.name && <div className="text-red-500 text-sm mt-2">{errors.name}</div>}
              </div>
            </div>
            {/* EMAIL */}
            <div>
              <div className="mb-3 font-bold">
                Email
              </div>
              <div className="mb-3">
                <input type="email" onChange={handleEmailChange} className="w-full bg-white px-2 py-2 rounded-lg" />
                {errors.email && <div className="text-red-500 text-sm mt-2">{errors.email}</div>}
              </div>
            </div>
            {/* PASSWORD */}
            <div>
              <div className="mb-3 font-bold">
                Password
              </div>
              <div className="mb-3">
                <input type="password" onChange={handlePasswordChange} className="w-full bg-white px-2 py-2 rounded-lg" />
                {errors.pass && <div className="text-red-500 text-sm mt-2">{errors.pass}</div>}
              </div>
            </div>
          </div>

          {/* SIGN UP */}
          <div className="flex flex-row-reverse mt-5">
            <button type="button" onClick={handleRegistration} className="bg-green-500 px-1 py-2 rounded-lg cursor-pointer w-full text-white font-bold">Sign Up</button>
          </div>

          {/* TO LOGIN PAGE */}
          <div className="flex flex-row justify-center text-sm font-light mt-5">
            <div className="mr-2">
              Already have an account?
            </div>
            <NavLink to="/login">
              <div className="text-blue-500 flex justify-end items-center">
                Login
              </div>
            </NavLink>
          </div>
        </div >
      </div>
    </>
  )
}
