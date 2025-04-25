export const Login = () => {
  return (
    <div className="flex flex-col w-1/2 bg-secondary-200 h-screen justify-center items-center gap-2.5">
      <section className="w-1/2">
        <div className="flex gap-2.5 justify-center items-center">
          <img src="ourbnb.svg" alt="hello" />
          <h1 className="text-4xl font-bold text-primary-400">Ourbnb</h1>
        </div>
        <form className="flex flex-col p-6">
          <label className="text-lg mb-1">Correo electronico</label>
          <input type="email" name="email" className="shadow-sm rounded-md px-4 py-2 text-secondary-400 mb-4 focus:outline-1 outline-secondary-400" placeholder="ejemplo@mail.com"/>

          <label className="text-lg mb-1">Contraseña</label>
          <input type="email" name="password" className="shadow-sm rounded-md px-4 py-2 text-secondary-400 mb-6 focus:outline-1 outline-secondary-400" placeholder="Tu contraseña"/>

          <button className="w-full bg-primary-300 rounded-md text-secondary-200 text-lg font-medium py-3 hover:bg-primary-400">Entrar</button>
        </form>
        <hr className="mx-6"/>
        <div className="mt-4 flex justify-center gap-2 text-lg">
          <span>¿No tienes una cuenta?</span>
          <button className="hover:underline underline-offset-4 hover:text-primary-300" >crear una cuenta</button>
        </div>
      </section>
    </div>
  )
}
