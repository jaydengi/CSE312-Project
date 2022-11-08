import './App.css';
import { useForm } from "react-hook-form";

function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = inputs => {
    const data = {
      password: inputs.Password,
      email: inputs.Email,
    }
    fetch("/info",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json()).then((data) => alert("The account id is: " + data))
  }

  

  return (
    <body class='bbbg'>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div class= 'formbg'> 
        <br></br>

        <span class='formTitle'>Create an Account</span>
        <form onSubmit={handleSubmit(onSubmit)}>

          <p class = "field">
              <label>Email</label>
              <input {...register("Email",{required: true, pattern: /^\S+@\S+$/i})}/>
              <p class="errors">
                {(errors.Email?.type === 'required' || errors.Email?.type === 'pattern') && "Email is incorrect!"}
              </p>
          </p>
         

          <p class = "field" id = "password">
            <label>Password</label>
            <input {...register("Password",{required: true})}></input>
            <p class="errors">
                {(errors.Password?.type === 'required') && "Password is required!"}
              </p>
          </p>
        
          <p class = "field">
            <input type="submit" />
          </p>
        </form>
      </div>
      

    </body>

    
    
  );

}






export default App;