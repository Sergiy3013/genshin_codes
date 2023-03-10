# Genshin Codes
### This tool will automatically collect HoYoLab daily login rewards on all your accounts.


![hoyolab codes](/images/hoyolab/hoyolab-codes.png)

---

## How to use this tool?
### 1) Fork this repository and you can move on to the next step.
  <details>
  <summary>Instruction</summary>

  To do this, log into your GitHub account and click on the button shown in the screenshot below
  ![Fork this repository](/images/github/github-01.png)
  </details>

### 2) Receiving Your Account Cookies
  <details>
  <summary>Instruction</summary>

  0. I'm using Chrome browser, if you're using a different browser, some names may vary.
  1. Open the [**get_cookies.js**](/get_cookies.js) file and copy its contents.

    ```
    var cookie = document.cookie
    cookie = cookie.replaceAll(" ","")
    var ask = confirm('Cookie: ' + cookie + '\n\nClick confirm to copy Cookie.'); 
    if (ask == true) { 
        copy(cookie); 
        msg = cookie 
    } 
    else msg = 'Cancel'
    ```

2. Go to https://genshin.hoyoverse.com/en/gift then login.
3. Right-click on the page and click on **View Code**, then click on the **Console** tab.
4. Paste the code you copied in the second paragraph and press **Enter**.
5. In the window that appears, click **Ok** and the necessary Cookies will be automatically copied to your clipboard. 
![Cookie copy window](/images/hoyolab/hoyolab-cookie.png)
</details>


### 3) Set up variables in GitHub
<details>
<summary>Instruction</summary>

1. Let's add Cookies to the variable, for this go to the following path in the cloned repository
**Settings** -> **Secrets**  -> **Actions**  -> **New repository secret**
![Path to add Cookies to repository variable](/images/github/github-02.png)
2. Enter a variable name and Cookies depending on what you want to set up your repository for. 
![Page for adding variables](/images/github/github-03.png)
In the first field you need to specify the name of the variable, in the second field Cookies. See examples below.
3. Variable name: `HOYOLAB_COOKIES`, Cookies example: `["cookies 1", "cookies 2", "cookies 3"]`
In this case, you need to open square brackets `[` list received in the section `Getting your account's Cookies`, Cookies must be in double quotes `"`, separated by commas and then close square brackets `]`.
![Adding Cookies for Multiple Accounts](/images/github/github-04.png)
</details>

### 4) Adding GitHub Actions
<details>
  <summary>Instruction</summary>

  Create an action
  **Actions** -> **Code activation**  -> **Run workflow**  -> **Run workflow**
  ![Adding Actions](/images/github/github-05.png)
</details>

---
#### **Sometimes Cookies need to be updated**