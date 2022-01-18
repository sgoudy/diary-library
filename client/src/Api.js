const Api = (function () {
  let base = window.location.protocol + '//' + window.location.hostname + '/api/';
  
  //Test for production host or local host
  const hostCheck = new RegExp( 'localhost|127.0.0.1', 'i');
  if (hostCheck.test(window.location.hostname)) {
    base = window.location.protocol + '//' + window.location.hostname + ':3001/api/'
  }

  /**
   * Get the base API path; add your query (the rest of the route) to the end of this.
   */
  const getBase = function () {
    return base
  }

  /**
   * Query the back end API.
   *
   * @param {String} query The full URL and query to request from the backend.
   * @param {String} type API.get, API.put, API.post, API.delete, or null; defaults to API.get.
   * @param {String} body The form body if sending large amounts of data or uploads; see Api.getBody().
   * @param {Function} callback The function to return the response back to.
   * @return {null} Return is used only as a short circuit to stop fatal errors from triggering.
   */
  const query = function (query, type, body, callback) {
    // Backwards compatibility fix: body will not always be present so it may be the callback.
    if (typeof body === 'function') {
      callback = body
      body = null
    }

    // Return immediately if the callback is missing.
    if (!callback || typeof callback != 'function') {
      console.log(
        'API ERROR: Incorrect call to Api.query check parameters: query, type, body, callback',
      )
      return
    }

    // Make sure we have a valid type or use GET.
    type = type || 'GET'

    // Handle the request response when it arrives.
    const http = new XMLHttpRequest()
    http.onreadystatechange = function () {
      if (http.readyState === 4) {
        // All responses should be a JSON string.
        let json = ''
        try {
          json = JSON.parse(http.responseText)
        } catch (error) {
          // This response wasn't a JSON string so it must be an error.
          json = {
            message: error.message,
          }
        }
        let status = false
        if (http.status >= 200 && http.status < 400) {
          status = true
        }
        callback(json, status, http.status)
      }
    }

    // Attempt to request data from the backend.
    try {
      if (body) {
        // If this is a POST or PUT there should be a body (FormData) object.
        http.open(type, query, true)
        http.withCredentials = query.includes('/login')
        http.send(body)
      } else {
        // Send empty body everything we need is in the URL.
        http.open(type, query, true)
        http.withCredentials = query.includes('/login')
        http.send()
      }
    } catch (error) {
      callback(error, false)
    }
  }

  /**
   * Takes an HTML form element and builds its FormData object.
   *
   * @param {Element} form An HTML form element.
   * @return {FormData} The FormData object for this form.
   */
  const getBody = function (form) {
    // This will most likely need updates later!
    // Help doc (ignore the jQuery): https://stackoverflow.com/a/21045034/3193156
    if (!form || form.tagName !== 'FORM') {
      console.log('API ERROR: getBody expects an HTML form element.')
      return
    }
    return new FormData(form)
  }

  /**
   * Takes an HTML form element or FormData object and returns an array of the forms
   * key value pairs. Has not been tested with file uploads.
   *
   * @param {Element|FormData} form An HTML form element or FormData object.
   * @return {Array} An array of objects, each object is a key value pair.
   */
  const getParts = function (form) {
    let formData = ''
    // Work out if we have a FormData object or not. Make it if we were given a form.
    if (typeof form === 'object' && form.toString().includes('FormData')) {
      formData = form
    } else if (!form || form.tagName !== 'FORM') {
      console.log('API ERROR: getParts expects an HTML form element or a FormData object.')
      return []
    } else {
      formData = getBody(form)
    }
    // Build the array of key value pairs.
    const values = []
    for (var [key, value] of formData.entries()) {
      values.push({
        key: key,
        value: value,
      })
    }
    return values
  }

  return {
    delete: 'DELETE',
    get: 'GET',
    getBase,
    getBody,
    getParts,
    post: 'POST',
    put: 'PUT',
    query,
  }
})()

export default Api
