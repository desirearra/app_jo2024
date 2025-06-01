import { renderOtpTemplate } from '../services/email.service';

describe('email.service', () => {
  it('should render a valid HTML template for OTP', () => {
    const code = '123456';
    const html = renderOtpTemplate(code);
    expect(html).toContain('123456');
    expect(html).toContain('<html>');
    expect(html).toContain('Votre code de vérification');
  });
});
