**Get User Exists**
----
Returns true if a user exists and false otherwise

* **URL**

  /users/api/v1.0/exists/<userid>

* **Method**

  `GET`

* **URL Params**

  **Required:**

  `userid=[integer]`

* **Data Params**

  None

* **Response**

  * **Code:** 200 <br />
    **Content:** `{id: 234893, exists: True}`

**Get User Object**
----
Returns user object from userid

* **URL**

  /users/api/v1.0/<userid>

* **Method**

  `GET`

* **URL Params**

  **Required:**

  `userid=[integer]`

* **Data Params**

  None

* **Response**

  * **Code:** 200 <br />
    **Content:** `TODO: USER OBJECT JSON`

**Post new User Object**
----
Makes new user object from request json

* **URL**

  /users/api/v1.0/register

* **Method**

  `POST`

* **URL Params**

  None

* **Data Params**

    ```json
    { 
      "id": 2,
      "full_name": "Victor Par",
      "phone_number": "604-384-3483",
      "credit": 40.30,
      "email": "testing@testing.com",
      "restaurant_id": 30483,
      "table_id": 34893,
      "role": 0 (0 if customer, 1 if waiter)
    }
    ```

* **Response**

  * **Code:** 200 <br />
    **Content:**
    ```json
    { 
      "id": 2,
      "full_name": "Victor Par",
      "phone_number": "604-384-3483",
      "credit": 40.30,
      "email": "testing@testing.com",
      "restaurant_id": 30483,
      "table_id": 34893,
      "role": 0 (0 if customer, 1 if waiter)
    }
    ```

