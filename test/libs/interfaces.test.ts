import { describe, expect, it } from "@jest/globals";
import { validatePayload } from './../../src/libs/interfaces';

describe('validators tests', () => {
     it('should fail validation when the format is incorrect',async () => {
         
        const payload = JSON.stringify({
            Random: 'random data'
        })
        expect(validatePayload(payload)).toBe(false)
     }),
     it('should fail validation when the phone number is incorrect',async () => {
        const payload = JSON.stringify({
            PhoneNumber: "+442867",
            Message: 'It wont work'
        })
        const result = validatePayload(payload)
        expect(result).toBe(false) 
     }),
     it('should pass validation when the format is correct',async () => {
         
        const payload = JSON.stringify({
            PhoneNumber: "+442867624091",
            Message: 'It will work'
        })
        expect(validatePayload(payload)).toBe(true)
     })
    })