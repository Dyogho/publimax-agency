# Actores:

- Clientes || sin cuenta
- Administradores || cuenta rol admin
- Usuarios creativos || cuenta rol creative
- Equipos de usuarios creativos

# Contexto:

1. El usuario contacta al adminitrador, mediante WhatsApp de manera externa al sistema.
2. El adminitrador entra al sistema y se logea (cuenta de administradores solo se puede crear mediante supabase o prisma studio, no desde sistema).
3. El admin crea al usuario en el section clients, aqui el form me sale datos name, email, phone y address. (esto cambiaremos para mejor ux y ui)
4. Voy al section campa;as, completo los datos y me genera el dashboard de cada campaign.

5. Para crear los user creative voy a section directorio y creo los usuarios creativos.

6. La creacionde equipos voy a unidades(teams) aqui esta bien el flujo

7. Como agrego un team a una campaign?

## Mejoras:

item 3. el form los datos tiene que estar en espa;ol (solo front no los datos) (name -> Nombre y apellidos, email => gmail, phone => Numero de celulare, address => Ubicacion), el phone debe divirse en dos sections |codigo de pais| numero| ej: +51 987654321. Los campos de ejemplo que se mapea tambien en espa;ol.

item 4. el form los datos tienen que esta en espa;ol (client => cliente, etc, etc), dar tips, ayudas para saber que colocar, en campos como roi audiencia, alcance, etc.

item 5. el formlulario de add new member, los campos en espa;ol (Full Name => Nombre y Apellidos, email adress => gmail, systems password => contrase;a, spcelized role => rol trabajo, system permission oculto). El email solo ingrese los campos de inciiales la direccion siempre es @publimax.com ej |---|@publimax.com| "---" solo se escribe el directorio esta establecido y no se puede editar (esto manejo en el front), el system permission que este oculto del form o el rol creative bloqueado sin que s epueda editar.

item 6. Igual que los datos que se pintan en el front se en espa;ol
