using System;
using System.IO;
using System.Web;


namespace MetricYardstick
{
    public class FetchTemplate
    {
        /// <summary>
        /// Reads the content of a stored HTML email template
        /// </summary>
        /// <param name="FileName"></param>
        /// <returns></returns>
        public static string ReadFile(string FileName)
        {
            try
            {
                String FILENAME = HttpContext.Current.Server.MapPath(FileName);
                using (StreamReader objStreamReader = File.OpenText(FILENAME))
                {
                    String contents = objStreamReader.ReadToEnd();
                    return contents;
                }
            }
            catch (Exception ex)
            {
            }
            return "";
        }
    }
}