Un ejemplo real de cuando se crea a un usuario, se describe todo el proceso de lo que
hace cada uno

1. infrastructure/controllers/dto/create-user.dto.ts: es el validador de las 
entradas, es el primero que actua cuando entran datos, intercepta el JSON,
comprueba que se cumplan las reglas que difinimos en los DTO, por ejemplo que 
sea string, que no este vacio el correo, que la contra tenga mas de 8 caracter.
Si falla manda un error 400, ahora si llega a pasar ahora seria un objeto de 
la clase dto (createuserdto) y tiene permiso para entrar.Aclarar que el dto no tiene
acceso a la base de datos solo valida el formato y sintaxis de los datos.


2. infrastructure/controllers/users.controller.ts: Que viene siendo el recepcionista
hace que coincida la ruta /users.Su body recibe el objeto de la clase (createuserdto)
que el dto o el famoso validador de entradas ya lo valido.Su unica mision es 
delegar el trabajo y pasarselo a aplication/create-user o depende el caso



3. application/create-user/create-user.service.ts: Aqui es la pura logica de negocio,
recibe el dto del controlador y toma desiciones por ejemplo si el correo ya existe
pues el dto ya dio la aprobacion de que si parece un correo y que no esta vacio,
*ejemplo de que application quiere saber si un correo ya esta en uso*
application tampoco tiene acceso a la bd pero le llama a la 
interfaz(.repository del domain) y gracias a nest intercepta la llamada y la 
redirige a persistence ya que el
si tiene acceso a la bd, y persistence le dice directamente a application si ya 
esta en uso o no dependiendo el caso y al finalizar application toma la decision
si este nuevo objeto es candidato o no para ser un nuevo usuario. este da 
la orden de guardar pero el no lo guarda


 4. domain/user.repository.ts: Tiene dos papeles muy importantes hacer de puente entre
 application y persistence, ya que el conecta a estos dos por si application tiene
 alguna duda persistence le conteste sus dudas y otra es que domain tiene sus propias reglas puras
 cuando el objeto pasa a domain(que es el nuevo usuario) le asigna sus reglas dependiendo
 de que tipo de usuario sea. por ejemplo si es un administrador pues le pone una 
 regla de que un administrador puede crear un administrador, o que si es el unico
 administrador del software este no pueda ser borrado o si es un usuario que este
 no pueda cambiar su contraseña hasta que ponga su contraseña anterior o que 
 un usuario no pueda crear administradores. Domain aun no guarda al usuario nuevo 
 a la bd y ni tiene acceso a el.

 aclaramos que el que tiene las reglas puras es en : Archivo: domain/user.model.ts (o user.aggregate.ts)
 y el que solo es puente es: Archivo: domain/user.repository.ts


 5. infrastructure/persistence/user.repository.ts: podriamos decir que es un traductor
 de typescript con sql, el conecta estos dos mundos. El es el responsable de 
 contestar las dudas que tenga application cuando este quiere comprobar algo. persistence
 tiene acceso a la bd, el tiene la habilidad de comportarse como un crud el puede
 crear,actualizar,leer y borrar, por ejemplo cuando applicatioon termine de verificar
 y todo este correcto este le dice a persistence toma este nuevo objeto y guardalo
 borrarlo o actualizalo dependiendo sea el caso. Persistence es el encargado de 
 guardar las cosas en la bd pero con ayuda de entities ya que este mapea donde deben
 de guardarse los datos


 6. infrastructure/entities/user.entity.ts: este no hace nada mas que mapear la
 informacion cuando persistence va a guardar algo, ayuda a que el nuevo usuario se guarde 
 en la tabla usuario y que sus perspectivos info se guarde donde se debe guardar.
 Tambien este se usa cuando solo hacen una consulta de leer



Extra: Que es typeorm ? es un tradcutor de ty con sql, em lugar de escribir consultas
a mano puedes usar metodos de js y typeorm hace la consulta por ti. ejemplo
asi lo escribimos en js

const user = new User();
user.nombre = 'Juan';

asi lo traduce typeorm a sql: INSERT INTO "usuario" ("nombre") VALUES ('Juan');