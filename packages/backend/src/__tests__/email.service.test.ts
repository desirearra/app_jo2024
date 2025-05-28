import { renderOtpTemplate, sendEmail } from '../services/email.service';

describe('email.service', () => {
  it('should render a valid HTML template for OTP', () => {
    const code = '123456';
    const html = renderOtpTemplate(code);
    expect(html).toContain('123456');
    expect(html).toContain('<html>');
    expect(html).toContain('Votre code de vérification');
  });

  it('should log the email sending (mock)', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await sendEmail('test@example.com', 'Test Subject', '<b>Test</b>');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('To: test@example.com'));
    spy.mockRestore();
  });
});
